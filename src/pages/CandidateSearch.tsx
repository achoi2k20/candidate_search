import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const initialCandidates = await searchGithub(0);
    setCandidates(initialCandidates);
    loadNextCandidate(initialCandidates);
  };

  const loadNextCandidate = (candidateList: Candidate[]) => {
    if (candidateList.length > 0) {
      const nextCandidate = candidateList.shift()!;
      setCandidates(candidateList);
      fetchCandidateDetails(nextCandidate.login);
    } else {
      setCurrentCandidate(null);
    }
  };

  const fetchCandidateDetails = async (username: string) => {
    const detailedCandidate = await searchGithubUser(username);
    setCurrentCandidate(detailedCandidate);
  };

  const saveCandidate = () => {
    if (currentCandidate) {
      const updatedSaved = [...savedCandidates, currentCandidate];
      setSavedCandidates(updatedSaved);
      localStorage.setItem('savedCandidates', JSON.stringify(updatedSaved));
    }
    loadNextCandidate(candidates);
  };

  const skipCandidate = () => {
    loadNextCandidate(candidates);
  };

  useEffect(() => {
    const storedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    setSavedCandidates(storedCandidates);
  }, []);

  return (
    <section>
      {currentCandidate ? (
        <div>
          <img src={currentCandidate.avatar_url} alt={`${currentCandidate.login}'s avatar`} />
          <h2>{currentCandidate.name}</h2>
          <p>Username: {currentCandidate.login}</p>
          <p>Location: {currentCandidate.location}</p>
          <p>Email: {currentCandidate.email}</p>
          <p>Company: {currentCandidate.company}</p>
          <a href={currentCandidate.html_url}>GitHub Profile</a>
          <div>
            <button onClick={saveCandidate}>+</button>
            <button onClick={skipCandidate}>-</button>
          </div>
        </div>
      ) : (
        <h2>No more candidates to review</h2>
      )}
    </section>
  );
};

export default CandidateSearch;
