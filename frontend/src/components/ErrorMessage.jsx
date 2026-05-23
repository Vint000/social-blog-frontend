function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p className="text-red-700 font-medium">Erro ao carregar</p>
      <p className="text-red-500 text-sm mt-1">{message}</p>
    </div>
  );
}

export default ErrorMessage;
