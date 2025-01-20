import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Repeat2 } from 'lucide-react';
import axios from 'axios';
import conf from '../conf/conf';
import { getCookie } from '../services/authService';

export default function Tweets() {
  const [tweets, setTweets] = useState([]);
  const [isLoading, setLoading] = useState(true);

  // Fetch tweets from backend
  const fetchTweets = async () => {
    try {
      const response = await axios.get(`${conf.BACKEND_URL}/users/tweetId`,{
        headers: { Authorization: `Bearer ${getCookie('accessToken')}` }, 
        withCredentials: true,
      }); // Replace <user_id> with the actual user ID
      setTweets(response.data.data); // Assuming the response contains the tweets in 'data' field
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tweets', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets(); // Fetch tweets when the component mounts
  }, []);

  // Like tweet handler
  const handleLike = async (tweetId) => {
    try {
      await axios.post(`${conf.BACKEND_URL}/tweets/${tweetId}/like`,{},{
        headers: { Authorization: `Bearer ${getCookie('accessToken')}` }, 
        withCredentials: true,
      });
      fetchTweets(); // Refresh tweets after the like action
    } catch (error) {
      console.error('Error liking tweet', error);
    }
  };

  return (
    <>
      <h2 className="text-xl sm:text-2xl font-semibold text-surface-800 dark:text-white mb-6">
        Latest Tweets
      </h2>
      <div className="space-y-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          tweets.map((tweet, index) => (
            <div key={index} className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-400 flex items-center justify-center text-white font-medium">
                  {tweet.author[0]} {/* Displaying the first letter of the author */}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-surface-800 dark:text-white">{tweet.author}</span>
                    <span className="text-surface-500 text-sm">{tweet.handle}</span>
                    <span className="text-surface-400 text-sm">· {tweet.time}</span>
                  </div>
                  <p className="mt-2 text-surface-600 dark:text-surface-300 whitespace-pre-line">{tweet.content}</p>
                  <div className="flex items-center gap-6 mt-3">
                    <button className="flex items-center gap-2 text-surface-500 hover:text-primary-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{tweet.replies}</span>
                    </button>
                    <button className="flex items-center gap-2 text-surface-500 hover:text-green-500 transition-colors">
                      <Repeat2 className="w-4 h-4" />
                      <span className="text-sm">{tweet.retweets}</span>
                    </button>
                    <button onClick={() => handleLike(tweet._id)} className="flex items-center gap-2 text-surface-500 hover:text-pink-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{tweet.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
