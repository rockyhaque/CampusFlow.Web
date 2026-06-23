import { useCallback, useEffect, useMemo, useState } from 'react';
import { feedbackService } from '../../services/feedback.service.js';
import useAuthStore from '../../stores/useAuthStore.js';
import useToastStore from '../../stores/useToastStore.js';
import { PAGE_SIZE } from './constants.js';

export function useLeaderboard() {
  const { user } = useAuthStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearchState] = useState('');
  const [filter, setFilterState] = useState('all');
  const [detailId, setDetailId] = useState(null);
  const [page, setPage] = useState(1);

  const setSearch = useCallback((value) => {
    setSearchState(value);
    setPage(1);
  }, []);

  const setFilter = useCallback((value) => {
    setFilterState(value);
    setPage(1);
  }, []);

  const loadLeaderboard = useCallback(() => {
    setLoading(true);
    setError(null);
    feedbackService.getLeaderboard(100)
      .then((r) => setData(Array.isArray(r) ? r : r?.data || []))
      .catch((e) => {
        const msg = e.response?.data?.message || 'Failed to load leaderboard.';
        setError(msg);
        useToastStore.getState().error(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const ratedOnly = useMemo(() => data.filter((d) => d.total_ratings > 0), [data]);
  const podium = ratedOnly.slice(0, 3);

  const stats = useMemo(() => {
    const totalVolunteers = data.length;
    const ratedCount = ratedOnly.length;
    const avgOfAvgs = ratedCount > 0
      ? (ratedOnly.reduce((acc, d) => acc + parseFloat(d.avg_rating || 0), 0) / ratedCount).toFixed(1)
      : null;
    const totalRatings = ratedOnly.reduce((acc, d) => acc + (d.total_ratings || 0), 0);
    return { totalVolunteers, ratedCount, avgOfAvgs, totalRatings };
  }, [data, ratedOnly]);

  const filtered = useMemo(() => {
    let list = data;
    if (filter === 'rated') list = list.filter((d) => d.total_ratings > 0);
    if (filter === 'unrated') list = list.filter((d) => d.total_ratings === 0);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((d) => (d.full_name || '').toLowerCase().includes(q));
    return list;
  }, [data, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagedList = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const myRank = user?.id ? data.findIndex((d) => d.volunteer_id === user.id) + 1 : 0;

  const rankOf = (volunteerId) => data.findIndex((d) => d.volunteer_id === volunteerId) + 1;

  return {
    user,
    data,
    loading,
    error,
    loadLeaderboard,
    search,
    setSearch,
    filter,
    setFilter,
    detailId,
    setDetailId,
    page,
    setPage,
    ratedOnly,
    podium,
    stats,
    filtered,
    totalPages,
    currentPage,
    pageStart,
    pagedList,
    myRank,
    rankOf,
  };
}
