import { createStore } from '@tanstack/store';

interface UiStoreProps {
    dialogs: Record<string, boolean>;
    setDialog: (dialog: string, open?: boolean) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}
//ui dialogs
export const UiStore = createStore<UiStoreProps>({
    dialogs: {},
    setDialog: (dialog, open = true) => {
        UiStore.setState(state => ({
            ...state,
            dialogs: {
                ...state.dialogs,
                [dialog]: open,
            },
        }));
    },
    sidebarOpen: true,
    setSidebarOpen: (open) => {
        UiStore.setState(state => ({
            ...state,
            sidebarOpen: open,
        }));
    },
});