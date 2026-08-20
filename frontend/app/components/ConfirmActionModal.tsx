type ConfirmActionModalProps = {
    isOpen: boolean;
    title: string;
    message: string;
    loading?: boolean;
    confirmText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmActionModal({
    isOpen,
    title,
    message,
    loading = false,
    confirmText = "Confirm",
    onConfirm,
    onCancel,
}: ConfirmActionModalProps) {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6">

                <div className="w-14 h-14 mx-auto bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl">
                    ?
                </div>

                <h2 className="text-xl font-bold text-slate-900 text-center mt-4">
                    {title}
                </h2>

                <p className="text-slate-500 text-center mt-3">
                    {message}
                </p>

                <div className="flex gap-3 mt-6">

                    <button
                        type="button"
                        disabled={loading}
                        onClick={onCancel}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={onConfirm}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-semibold"
                    >
                        {loading ? "Updating..." : confirmText}
                    </button>

                </div>

            </div>

        </div>
    );
}