using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Runtime.InteropServices;

namespace QuickDraw.Hubs
{
    public class GameHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> _connectedUsers = new();
        private static readonly ConcurrentDictionary<string, int> _scores = new();
        private const string UPDATE_USER_LIST = "UpdateUserList";
        private const string UPDATE_SCORE = "UpdateScore";

        public async Task JoinGame(string displayName)
        {
            if (!string.IsNullOrEmpty(displayName))
            {
                _connectedUsers.TryAdd(Context.ConnectionId, displayName);
                _scores.TryAdd(Context.ConnectionId, 0);
                //await UpdateUserList();
                await UpdateScores();
            }
        }

        public async Task IncrementScore()
        {
            if (_scores.TryGetValue(Context.ConnectionId, out int score))
            {
                _scores[Context.ConnectionId] = ++score;
            }
            await UpdateScores();
        }

        private async Task UpdateScores()
        {
            var userScores = _connectedUsers
                .Take(10)
                .Select(z => new
                {
                    DisplayName = z.Value,
                    Score = _scores[z.Key]
                })
                .OrderByDescending(z => z.Score)
                .ThenBy(z => z.DisplayName);
            await Clients.All.SendAsync(UPDATE_SCORE, userScores);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (_connectedUsers.TryRemove(Context.ConnectionId, out _))
            {
                //await UpdateUserList();
                await UpdateScores();
            }
            await base.OnDisconnectedAsync(exception);
        }

        private async Task UpdateUserList()
        {
            await Clients.All.SendAsync(UPDATE_USER_LIST, _connectedUsers.Values);
        }
    }
}
