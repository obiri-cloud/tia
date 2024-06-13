import React, { useState, useEffect } from "react";
import moment, { Moment, Duration } from "moment";
import { Button } from "../ui/button";

interface CountdownProps {
  startTime: string;
  time: number | null;
  endLab: () => void;
}

export const CountdownClock: React.FC<CountdownProps> = ({
  startTime,
  time,
  endLab,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<Duration | null>(null);
  const [fiveMinLeft, setFiveMinLeft] = useState(false);
  const [tenSecLeft, setTenSecLeft] = useState(false);

  useEffect(() => {
    const startMoment = moment(startTime);

    const interval = setInterval(() => {
      const now = moment();

      const futureTime = moment(startMoment).add(time, "minutes");
      const duration = moment.duration(futureTime.diff(now));

      if (duration.asSeconds() <= 300) {
        setFiveMinLeft(true);
      } else {
        setFiveMinLeft(false);
      }

      if (duration.asSeconds() <= 10) {
        setTenSecLeft(true);
      } else {
        setTenSecLeft(false);
      }
      if (duration.asSeconds() <= 0) {
        setFiveMinLeft(false);
        setTenSecLeft(false);
        clearInterval(interval);
        endLab();
        setTimeRemaining(moment.duration(0));
      } else {
        setTimeRemaining(duration);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (time: Duration | null) => {
    if (time) {
      const hours = time.hours().toString().padStart(2, "0");

      const minutes = time.minutes().toString().padStart(2, "0");
      const seconds = time.seconds().toString().padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }
  };

  return (
    <div
      id="link"
      className="timer text-[#d4d4d4] flex items-center"
      // className={`px-3 shadow-md p-2 rounded-lg font-medium h-10 ${
      //   tenSecLeft ? "shake-card" : ""
      // } ${
      //   !fiveMinLeft
      //     ? "text-white bg-danger"
      //     : "text-white bg-black  font-medium "
      // }`}
    >
      <p>{formatTime(timeRemaining)}</p>
    </div>
  );
};
