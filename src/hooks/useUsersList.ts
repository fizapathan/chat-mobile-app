import { getUsers, useUsersStore } from '../store';

export const useUsersList = () => {
    const users = getUsers();
    const setUsers = useUsersStore((state) => state.setUsers);

    return {
        users,
        setUsers
    };
};