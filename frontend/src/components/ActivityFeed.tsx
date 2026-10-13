'use client';
import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

export default function ActivityFeed() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const handlers = [
      'product:new',
      'product:approved',
      'quotation:new',
      'payment:approved',
      'payment:received',
    ];
    const add = (ev: string) => (data: any) =>
      setEvents((p) =>
        [{ ev, data, time: new Date().toLocaleTimeString() }, ...p].slice(0, 20)
      );
    handlers.forEach((ev) => socket.on(ev, add(ev)));
    return () => handlers.forEach((ev) => socket.off(ev));
  }, []);

  if (events.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4 text-center">
        Waiting for live events…
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {events.map((e, i) => (
        <li key={i} className="py-3 flex justify-between items-center text-sm">
          <span className="font-semibold text-[#1E88E5]">{e.ev}</span>
          <span className="text-gray-400 text-xs">{e.time}</span>
        </li>
      ))}
    </ul>
  );
}