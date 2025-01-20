import React from 'react';

export function PageNotFound({type="Page"}){
      return (
        <div className='max-h-screen m-auto mt-12 flex flex-col justify-center items-center gap-3 text-slate-800 dark:text-slate-300'>
            <h1 className='text-3xl font-bold'>404 {type} Not Found</h1>
            <p className='text-lg'>Oop's! The {type.toLowerCase()} you are looking for does not exist.</p>
            <a href="/" className='underline text-md font-semibold decoration-auto decoration-sky-800 hover:decoration-2 hover:decoration-sky-300'>
            Back to Homepage &#8626;</a>
        </div>
      );
}