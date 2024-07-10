// startButton.tsx
import Link from 'next/link';

export default function StartButton() {
  return (
    <>
    <Link href="/design" className="flex justify-center items-center">
      <button className="px-10 py-2 bg-blue-300 text-background rounded hover:bg-blue-400">
      Commencer a designer
      </button>
    </Link>
    <Link href="/form" className="flex justify-center items-center">
      <button className="px-10 py-2 bg-green-300 text-background rounded hover:bg-green-400">
      Aller au formulaire
      </button>
    </Link>
    </>
  );
}