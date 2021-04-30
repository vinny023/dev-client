import * as Sentry from 'sentry-expo';

Sentry.init({
    dsn: "https://801dcaccf1754731ac6162c4603087ad@o578775.ingest.sentry.io/5735190",
    enableInExpoDevelopment: true,
    debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
  });

  export default Sentry