type ConfirmDeleteModalProps = {
    isOpen: boolean;
    title?: string;
    message: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDeleteModal({
    isOpen,
    title = "Delete Confirmation",
    message,
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDeleteModalProps) {

    // Modal close hai to kuch render nahi karo
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Background Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 mx-4">

                {/* Icon */}
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto">
                    ⚠
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-slate-900 text-center mt-4">
                    {title}
                </h2>

                {/* Dynamic Message */}
                <p className="text-slate-600 text-center mt-3">
                    {message}
                </p>

                <p className="text-sm text-red-500 text-center mt-2">
                    This action cannot be undone.
                </p>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 rounded-lg font-semibold"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>

                </div>

            </div>

        </div>
    );
}