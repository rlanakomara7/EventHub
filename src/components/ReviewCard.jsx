function ReviewCard({ review }) {
  return (
    <article className="flex flex-col h-full mt-auto rounded-xl border shadow-lg border-gray-200 bg-white-secondary p-5">
      <div className="mb-5">
        <p className="text-3xl font-bold leading-none text-orange-primary">"</p>
      </div>

      <p className="mb-5 text-base leading-6 text-gray-secondary">
        {review.text}
      </p>

      <div className=" mt-auto flex items-center gap-3 border-t border-gray-200 pt-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {review.initial}
        </div>

        <div>
          <h4 className="font-semibold text-black-primary">{review.name}</h4>

          <p className="text-sm text-gray-secondary">
            {review.role} . {review.company}
          </p>
        </div>
      </div>
    </article>
  );
}

export default ReviewCard;
