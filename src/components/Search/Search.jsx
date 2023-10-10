import PropTypes from "prop-types";
export default function Search({ refObj }) {
  return (
    <>
      <div
        ref={refObj}
        id="geocoder-container"
        // className="geocorder-main-container max-w-[300px]"
      ></div>
    </>
  );
}
Search.propTypes = {
  refObj: PropTypes.object,
};
