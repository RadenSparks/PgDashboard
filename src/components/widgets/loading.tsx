

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-64 w-full gap-2">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>
                <div className="absolute inset-0 rounded-full border-4 border-b-transparent border-blue-300 animate-spin [animation-delay:-0.5s]"></div>
            </div>
            <p className="text-blue-500 font-semibold animate-pulse">Đang tải dữ liệu...</p>
        </div>
    )
}

export default Loading