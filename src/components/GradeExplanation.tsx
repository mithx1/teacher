import type { GradeBreakdown, GradingScheme } from '../grading/types';

/** Plain-language explanation of how a grade was computed (ADR-004: readable grade explanations). */
export function GradeExplanation({ breakdown, scheme }: { breakdown: GradeBreakdown; scheme: GradingScheme }) {
  if (breakdown.grade === null) {
    return <p>No scores have been counted yet, so there's nothing to calculate.</p>;
  }
  return (
    <div className="explanation">
      <ol>
        {breakdown.categories.map((c) => (
          <li key={c.categoryId}>
            <strong>{c.name}</strong>{' '}
            {c.percentage === null ? (
              <span>has no scores yet, so it isn't counted for now (normally {c.weight}% of the grade).</span>
            ) : (
              <span>
                {c.earned} of {c.possible} points = {c.percentage}%. This counts for {c.effectiveWeight}% of the grade
                {c.effectiveWeight !== c.weight && <> (normally {c.weight}%)</>}, adding <strong>{c.weightedScore}</strong>{' '}
                points.
              </span>
            )}
          </li>
        ))}
      </ol>
      {breakdown.reweighted && (
        <p className="note">
          Because {breakdown.categoriesWithoutData.join(' and ')} {breakdown.categoriesWithoutData.length > 1 ? 'have' : 'has'}{' '}
          no scores yet, the other categories are scaled up to make 100%. This grade will change as more work is
          released.
        </p>
      )}
      <p>
        Adding these up gives <strong>{breakdown.initialGrade}</strong>
        {scheme.transmutation ? (
          <>
            , which converts to <strong>{breakdown.grade}</strong> on the report-card scale
          </>
        ) : null}
        . The passing grade is {scheme.passingGrade}.
      </p>
    </div>
  );
}
