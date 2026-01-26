import PropTypes from "prop-types";

Timer.propTypes = {
  total: PropTypes.number.isRequired,
};
export default function Timer({ total }) {
  return <>{total} seconds</>;
}
