import { trpc } from '../utils/trpc';
import type { NextPage } from 'next';
import { getOptionsForVote } from '@/utils/getRandomPokemon';

const Home: NextPage = () => {
  const [first, second] = getOptionsForVote();

  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }]);
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: second }]);
  console.log(firstPokemon.data?.name);
  console.log(secondPokemon.data?.name);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="text-2xl text-center">Which Pokemon is rounder?</div>
        <div className="p-2" />
        <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
          <div className="w-64 h-64 flex flex-col">
            <img
              src={firstPokemon.data?.sprites.front_default}
              className="w-full"
            />
            <div className="text-xl text-center capitalize mt-[-2rem]">
              {firstPokemon.data?.name}
            </div>
          </div>
          <div className="p-8">vs</div>
          <div className="w-64 h-64 flex flex-col">
            <img
              src={secondPokemon.data?.sprites.front_default}
              className="w-full"
            />
            <div className="text-xl text-center capitalize mt-[-2rem]">
              {secondPokemon.data?.name}
            </div>
          </div>
        </div>
        <div className="p-2" />
      </div>
    </>
  );
};

export default Home;
