import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

const Avaliacoes = () => {
  // Dados de exemplo para avaliações e notas
  const avaliacoes = [
    {
      id: 1,
      professor: 'Prof. Maria',
      notaMedia: 4.8,
      provas: [
        { id: 1, nome: 'Prova 1', nota: 9.5 },
        { id: 2, nome: 'Prova 2', nota: 8.7 },
      ],
    },
    {
      id: 2,
      professor: 'Prof. João',
      notaMedia: 4.5,
      provas: [
        { id: 1, nome: 'Prova 1', nota: 8.0 },
        { id: 2, nome: 'Prova 2', nota: 9.0 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Avaliações das Aulas</h1>
        <div className="space-y-6">
          {avaliacoes.map((avaliacao) => (
            <Card key={avaliacao.id} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {avaliacao.professor}
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>{avaliacao.notaMedia.toFixed(1)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Notas das Provas</h3>
                <ul className="list-disc list-inside">
                  {avaliacao.provas.map((prova) => (
                    <li key={prova.id}>
                      {prova.nome}: {prova.nota.toFixed(1)}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Avaliacoes;
