using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace QuickDraw.Hubs
{
    public class GameHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> _connectedUsers = new();
        private const string UPDATE_USER_LIST = "UpdateUserList";
        private const string UPDATE_SCORE = "UpdateScore";

        public async Task JoinGame(string displayName)
        {
            if (!string.IsNullOrEmpty(displayName))
            {
                _connectedUsers.TryAdd(Context.ConnectionId, displayName);
                await UpdateUserList();
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (_connectedUsers.TryRemove(Context.ConnectionId, out _))
            {
                await UpdateUserList();
            }
            await base.OnDisconnectedAsync(exception);
        }

        private async Task UpdateUserList()
        {
            await Clients.All.SendAsync(UPDATE_USER_LIST, _connectedUsers.Values);
        }
    }
}
