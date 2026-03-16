export default function Loading() {
  return (
    <div className="p-4 mx-auto w-full max-w-200">
      <div className="skeleton h-8 w-3/4 my-4">{/* heading1 */}</div>
      <div className="skeleton h-20 w-full my-2">{/* <p> */}</div>
      <div className="skeleton h-7 w-2/4 mt-4 mb-3">{/* heading2 */}</div>
      <div className="skeleton h-40 w-full my-2">{/* <p> */}</div>
      <div className="skeleton h-7 w-2/4 mt-4 mb-3">{/* heading2 */}</div>
      <div className="skeleton h-40 w-full my-2">{/* <p> */}</div>
    </div>
  );
}
