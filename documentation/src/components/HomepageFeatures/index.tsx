import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Track whatever you want',
    Svg: require('@site/static/img/undraw_note-list.svg').default,
    description: (
      <>
        Create your own attributes what to track daily and watch them in a list
        or calendar view.
      </>
    ),
  },
  {
    title: 'Medication planner',
    Svg: require('@site/static/img/undraw_medicine.svg').default,
    description: (
      <>Track your medication and keep track of your medication history.</>
    ),
  },
  {
    title: 'Own your data',
    Svg: require('@site/static/img/undraw_cloud-files.svg').default,
    description: <>Everything is self hosted and open source.</>,
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className='text--center'>
        <Svg className={styles.featureSvg} role='img' />
      </div>
      <div className='text--center padding-horiz--md'>
        <Heading as='h3'>{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className='container'>
        <div className='row'>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
