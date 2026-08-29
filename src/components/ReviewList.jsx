import ReviewCard from "./ReviewCard";

function ReviewList({ reviews }) {
  return (
    <>
      <main className="h-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </main>
    </>
  );
}

export default ReviewList;
