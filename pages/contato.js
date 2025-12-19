import ContactForm from '../components/ContactForm'

export default function Contato() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Contato</h1>
      <p className="text-gray-600 mb-8">
        Use o formulário abaixo para enviar uma mensagem.
      </p>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <ContactForm />
      </div>
    </div>
  )
}


