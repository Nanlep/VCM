import { Initiative, Vote, AggregatedResult } from '../types';
import { SCORING_WEIGHTS } from '../constants';

export const calculateAggregation = (initiatives: Initiative[], votes: Vote[]): AggregatedResult[] => {
  return initiatives.map(init => {
    const initVotes = votes.filter(v => v.initiativeId === init.id);
    const count = initVotes.length;

    if (count === 0) {
      return {
        initiativeId: init.id,
        name: init.name,
        avgImportance: 0,
        avgFeasibility: 0,
        avgUrgency: 0,
        avgAlignment: 0,
        vectorScore: 0,
        voteCount: 0
      };
    }

    const sum = initVotes.reduce((acc, v) => ({
      imp: acc.imp + v.scores.importance,
      fea: acc.fea + v.scores.feasibility,
      urg: acc.urg + v.scores.urgency,
      ali: acc.ali + v.scores.alignment,
    }), { imp: 0, fea: 0, urg: 0, ali: 0 });

    const avgImp = sum.imp / count;
    const avgFea = sum.fea / count;
    const avgUrg = sum.urg / count;
    const avgAli = sum.ali / count;

    // Vector Score Calculation (normalized to 0-100 based on 1-5 scale)
    // Formula: Weighted Avg of (Score / 5 * 100)
    const rawScore = 
      (avgImp * SCORING_WEIGHTS.importance) +
      (avgFea * SCORING_WEIGHTS.feasibility) +
      (avgUrg * SCORING_WEIGHTS.urgency) +
      (avgAli * SCORING_WEIGHTS.alignment);
    
    // Raw score is on 1-5 scale. Convert to percentage.
    // ((Score - 1) / 4) * 100 maps 1->0, 5->100
    // Or simply Score / 5 * 100. Let's use simple percentage for clarity.
    const vectorScore = (rawScore / 5) * 100;

    return {
      initiativeId: init.id,
      name: init.name,
      avgImportance: parseFloat(avgImp.toFixed(1)),
      avgFeasibility: parseFloat(avgFea.toFixed(1)),
      avgUrgency: parseFloat(avgUrg.toFixed(1)),
      avgAlignment: parseFloat(avgAli.toFixed(1)),
      vectorScore: Math.round(vectorScore),
      voteCount: count
    };
  }).sort((a, b) => b.vectorScore - a.vectorScore);
};
