import { trpc } from '../utils/trpc';
import type { NextPage } from 'next';
import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { useState } from 'react';

const btn =
  'inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  // const [first, second] = getOptionsForVote();
  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }]);
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: second }]);
  console.log(firstPokemon);
  console.log(secondPokemon);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const voteForRoundest = (selected: number) => {
    // todo

    updateIds(() => getOptionsForVote());
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="text-2xl text-center">Which Pokemon is rounder?</div>
        <div className="p-2" />
        <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
          <div className="w-64 h-64 flex flex-col items-center">
            <img
              src={firstPokemon.data?.sprites.front_default}
              className="w-full"
            />
            <div className="text-xl text-center capitalize mt-[-2rem]">
              {firstPokemon.data?.name}
            </div>
            <button className={btn} onClick={() => voteForRoundest(first)}>
              Rounder
            </button>
          </div>
          <div className="p-8">vs</div>
          <div className="w-64 h-64 flex flex-col items-center">
            <img
              src={secondPokemon.data?.sprites.front_default}
              className="w-full"
            />
            <div className="text-xl text-center capitalize mt-[-2rem]">
              {secondPokemon.data?.name}
            </div>
            <button className={btn} onClick={() => voteForRoundest(second)}>
              Rounder
            </button>
          </div>
        </div>
        <div className="p-2" />
      </div>
    </>
  );
};

export default Home;
