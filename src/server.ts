import { run } from './database';
import { app } from './app';

const PORT = 4040;
run()
  .then(() => {
    console.log('Database initialized successfully');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/graphql`);
    });
  })
  .catch((error) => console.error('Failed to run the server', error));