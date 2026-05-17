function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p className="text-red-700 font-medium">Erro ao carregar</p>
      <p className="text-red-500 text-sm mt-1">{message}</p>
      <p className="text-gray-500 text-xs mt-2">
        Verifique se o servidor está rodando em localhost:3000
      </p>
    </div>
  );
}

export default ErrorMessage;
