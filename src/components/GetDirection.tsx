interface GetDirectionProps {
  onGetDirection: () => void;
  onClose: () => void;
}

export default function GetDirection({ onGetDirection, onClose }: GetDirectionProps) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-auto">
      <div className="bg-white rounded-lg shadow-xl border-2 border-red-500 px-6 py-4 flex items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={onGetDirection}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-semibold text-sm shadow-md"
          >
            GET DIRECTION
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-semibold text-sm shadow-md"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
