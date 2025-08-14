import { Link } from '@tanstack/react-router';

const notFoundRoute = () => {
  return (
    <div>
      <p>Not found!</p>
      <Link to="/">Go home</Link>
    </div>
  );
};

export default notFoundRoute;
