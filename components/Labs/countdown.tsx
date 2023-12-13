import React, { useState, useEffect } from "react";
import moment, { Moment, Duration } from "moment";

interface CountdownProps {
  startTime: string;
  endLab: () => void;
}

export const CountdownClock: React.FC<CountdownProps> = ({
  startTime,
  endLab,
}) => {

  const [timeRemaining, setTimeRemaining] = useState<Duration | null>(null);
  const [fiveMinLeft, setFiveMinLeft] = useState(false);
  const [tenSecLeft, setTenSecLeft] = useState(false);

  useEffect(() => {
    const startMoment = moment(startTime);
    console.log("startMoment", startMoment);

    const interval = setInterval(() => {
      const now = moment();

      const futureTime = moment(startMoment).add(60, "minutes");
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
      className={`font-jet font-bold shadow-md p-2 rounded-lg ${
        tenSecLeft ? "shake-card" : ""
      } ${fiveMinLeft ? "text-red-900 bg-red-300" : "text-black bg-green-300"}`}
    >
      <p>{formatTime(timeRemaining)}</p>
    </div>
  );
};
