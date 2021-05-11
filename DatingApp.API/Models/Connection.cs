namespace DatingApp.API.Models
{
    public class Connection
    {
        public Connection()
        {
        }

        public Connection(string connetionId, string username)
        {
            this.ConnectionId = connetionId;
            this.Username = username;

        }
        public string ConnectionId { get; set; }
        public string Username { get; set; }

    }
}