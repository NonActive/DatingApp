using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MessageRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;

        }
        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var messagesQuery = _context.Messages.OrderByDescending(m => m.MessageSent).AsQueryable();

            messagesQuery = messageParams.Container switch
            {
                "Inbox" => messagesQuery.Where(m => m.RecipientUsername == messageParams.Username && m.RecipientDeleted == false),
                "Outbox" => messagesQuery.Where(m => m.SenderUsername == messageParams.Username && m.SenderDeleted == false),
                _ => messagesQuery.Where(m => m.RecipientUsername == messageParams.Username && m.RecipientDeleted == false &&  m.DateRead == null)
            };

            var messages = messagesQuery.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber,
                messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var messages = await _context.Messages
                .Include(m => m.Sender).ThenInclude(u => u.Photos)
                .Include(m => m.Recipient).ThenInclude(u => u.Photos)
                .Where(m => m.SenderUsername == recipientUsername && m.RecipientDeleted == false && m.RecipientUsername == currentUsername
                    || m.SenderUsername == currentUsername && m.SenderDeleted == false && m.RecipientUsername == recipientUsername)
                .OrderBy(m => m.MessageSent)
                .ToListAsync();

            var unreadMessages = messages.Where(m => m.DateRead == null 
                && m.RecipientUsername == currentUsername).ToList();

            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.Now;
                }

                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}