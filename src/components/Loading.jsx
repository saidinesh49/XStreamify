import React from 'react'

function Loading() {
  return (
    <div className='flex justify-center items-center p-4'>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 rounded-full border-4 border-transparent border-t-primary-400 animate-spin animate-delay-150"></div>
        </div>
      </div>
    </div>
  )
}

export default Loading;
