import { Dialog } from "@/components/Dialog";
import { useUserStore } from "@/store/userStore";

interface UserDialogProps {
    onClose: (status?: string) => void;
}

export const UserDialog = ({ onClose = () => "" }: UserDialogProps) => {
    const { user, open, closeUserDialog, setUser } = useUserStore();

    const handleClose = () => {
        onClose();
        closeUserDialog();
    };

    const handleReset = () => {
        setUser(null);
    };

    return (
        <Dialog animation='zoom' maskAnimation='fade' visible={open} title='User Dialog' onClose={handleClose}>
            <p>User Dialog</p>
            {/* <p>{JSON.stringify(user || {})}</p> */}
        </Dialog>
    );
};
