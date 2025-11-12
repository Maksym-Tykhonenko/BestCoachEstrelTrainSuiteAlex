import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

export const StoreContext = createContext(undefined);
export const useStore = () => useContext(StoreContext);

const TEAMS_KEY = 'BESTCOACH_TEAMS';

export const ContextProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [bestTrainNotificationsEnabled, setBestTrainNotificationsEnabled] =
    useState(true);

  useEffect(() => {
    const loadBestCoachTeams = async () => {
      try {
        const json = await AsyncStorage.getItem(TEAMS_KEY);
        if (json) setTeams(JSON.parse(json));
      } catch (e) {
        console.log('Error loading teams', e);
      }
    };
    loadBestCoachTeams();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(TEAMS_KEY, JSON.stringify(teams)).catch(e =>
      console.log('Error saving teams', e),
    );
  }, [teams]);

  const addTeam = team => {
    setTeams(prev => [...prev, { id: Date.now().toString(), ...team }]);
  };

  const deleteTeam = teamId => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  const updateTeamPlayers = (teamId, newPlayers) => {
    setTeams(prev =>
      prev.map(t =>
        t.id === teamId
          ? { ...t, playersList: newPlayers, players: newPlayers.length }
          : t,
      ),
    );
  };

  // ✅ Очистка всех данных (если нужно для тестов)
  const clearTeams = async () => {
    setTeams([]);
    await AsyncStorage.removeItem(TEAMS_KEY);
  };

  const value = {
    teams,
    addTeam,
    deleteTeam,
    updateTeamPlayers,
    clearTeams,
    bestTrainNotificationsEnabled,
    setBestTrainNotificationsEnabled,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
