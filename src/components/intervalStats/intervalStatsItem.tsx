import styles from './intervalStatsItem.module.css';

interface IntervalStatsItemProps {
  day: string;
  time: string;
}

const IntervalStatsItem = ({ day, time }: IntervalStatsItemProps) => (
  <div className={styles.container}>
    <h4>{day}</h4>
    <p>{time}</p>
  </div>
);

export default IntervalStatsItem;
