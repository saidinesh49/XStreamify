import React from 'react';
import ContentCard from '../components/ContentCard';

const content = [
  {
    title: "The Art of Mindful Living - A Journey Through Meditation",
    author: "Peaceful Minds",
    views: "245K",
    time: "2 days",
    thumbnail: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Morning Routine: Start Your Day with Intention",
    author: "Daily Wellness",
    views: "182K",
    time: "5 days",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Nature Sounds for Deep Focus and Relaxation",
    author: "Calm Space",
    views: "498K",
    time: "1 week",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Minimalist Living: Finding Peace in Simplicity",
    author: "Modern Zen",
    views: "325K",
    time: "3 days",
    thumbnail: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "The Art of Mindful Living - A Journey Through Meditation",
    author: "Peaceful Minds",
    views: "245K",
    time: "2 days",
    thumbnail: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Morning Routine: Start Your Day with Intention",
    author: "Daily Wellness",
    views: "182K",
    time: "5 days",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Nature Sounds for Deep Focus and Relaxation",
    author: "Calm Space",
    views: "498K",
    time: "1 week",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Minimalist Living: Finding Peace in Simplicity",
    author: "Modern Zen",
    views: "325K",
    time: "3 days",
    thumbnail: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "The Art of Mindful Living - A Journey Through Meditation",
    author: "Peaceful Minds",
    views: "245K",
    time: "2 days",
    thumbnail: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Morning Routine: Start Your Day with Intention",
    author: "Daily Wellness",
    views: "182K",
    time: "5 days",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Nature Sounds for Deep Focus and Relaxation",
    author: "Calm Space",
    views: "498K",
    time: "1 week",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Minimalist Living: Finding Peace in Simplicity",
    author: "Modern Zen",
    views: "325K",
    time: "3 days",
    thumbnail: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "The Art of Mindful Living - A Journey Through Meditation",
    author: "Peaceful Minds",
    views: "245K",
    time: "2 days",
    thumbnail: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Morning Routine: Start Your Day with Intention",
    author: "Daily Wellness",
    views: "182K",
    time: "5 days",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Nature Sounds for Deep Focus and Relaxation",
    author: "Calm Space",
    views: "498K",
    time: "1 week",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Minimalist Living: Finding Peace in Simplicity",
    author: "Modern Zen",
    views: "325K",
    time: "3 days",
    thumbnail: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "The Art of Mindful Living - A Journey Through Meditation",
    author: "Peaceful Minds",
    views: "245K",
    time: "2 days",
    thumbnail: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Morning Routine: Start Your Day with Intention",
    author: "Daily Wellness",
    views: "182K",
    time: "5 days",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Nature Sounds for Deep Focus and Relaxation",
    author: "Calm Space",
    views: "498K",
    time: "1 week",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Minimalist Living: Finding Peace in Simplicity",
    author: "Modern Zen",
    views: "325K",
    time: "3 days",
    thumbnail: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "The Art of Mindful Living - A Journey Through Meditation",
    author: "Peaceful Minds",
    views: "245K",
    time: "2 days",
    thumbnail: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Morning Routine: Start Your Day with Intention",
    author: "Daily Wellness",
    views: "182K",
    time: "5 days",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Nature Sounds for Deep Focus and Relaxation",
    author: "Calm Space",
    views: "498K",
    time: "1 week",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Minimalist Living: Finding Peace in Simplicity",
    author: "Modern Zen",
    views: "325K",
    time: "3 days",
    thumbnail: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&q=80&w=1000"
  }
];

export default function Home() {
  return (
    <div className="pt-20 px-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-surface-800 dark:text-white mb-6">
        Recommended for you
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {content.map((item, index) => (
          <ContentCard key={index} {...item} />
        ))}
        </div>
      </div>
  );
}