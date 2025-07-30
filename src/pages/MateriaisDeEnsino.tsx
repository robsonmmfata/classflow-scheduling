"use client"; // Marca o componente como um Client Component para interatividade

import React, { useState, useRef, ChangeEvent } from 'react'; // Importados useRef e ChangeEvent
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Importado Label para os campos de input
import { useToast } from '@/hooks/use-toast'; // Importado useToast para feedback
import {
  Search,
  FileText,       // Para documentos PDF/Texto
  Video,          // Para vídeos
  Link,           // Para links externos (genérico)
  BookOpen,       // Para artigos/e-books
  Download,       // Para botões de download (pode ser usado para áudios, planilhas)
  Tag,            // Para categorias
  Star,           // Para materiais em destaque
  Mic,            // Para áudios
  Globe,          // Para cultura/idiomas
  Upload,         // Para o ícone de upload
  FileSpreadsheet, // Para arquivos XLS
  FileText as FileDoc, // Renomeado FileText para FileDoc para evitar conflito com PDF
} from "lucide-react";

// Definição de tipo para um Material (opcional, mas boa prática)
interface Material {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  link: string;
  isFeatured: boolean;
}

// Dados mock para os materiais de ensino (atualizados para Português e Espanhol para estrangeiros)
const initialMockMaterials: Material[] = [
  // Materiais de Português
  {
    id: 'pt-1',
    title: 'Gramática Essencial do Português Brasileiro (Nível A1-A2)',
    description: 'Um guia prático com as regras gramaticais básicas e exercícios para iniciantes.',
    type: 'PDF',
    category: 'Português',
    link: '#', // Simula um link para download/visualização
    isFeatured: true,
  },
  {
    id: 'pt-2',
    title: 'Diálogos Cotidianos em Português: Conversação (Nível B1)',
    description: 'Vídeos com situações do dia a dia para praticar a escuta e a fala em português.',
    type: 'Video',
    category: 'Português',
    link: '#',
    isFeatured: true,
  },
  {
    id: 'pt-3',
    title: 'Vocabulário Básico para Viagem no Brasil',
    description: 'Lista de palavras e frases essenciais para turistas e viajantes no Brasil.',
    type: 'PDF',
    category: 'Português',
    link: '#',
    isFeatured: false,
  },
  {
    id: 'pt-4',
    title: 'Cultura Brasileira: Festas e Tradições',
    description: 'Artigo explorando as principais festas e costumes do Brasil, com vocabulário relacionado.',
    type: 'Artigo',
    category: 'Cultura Brasileira',
    link: '#',
    isFeatured: false,
  },
  {
    id: 'pt-5',
    title: 'Exercícios de Pronúncia de Português (Áudio)',
    description: 'Arquivos de áudio para praticar a pronúncia correta de palavras e frases em português.',
    type: 'Audio', // Novo tipo
    category: 'Português',
    link: '#',
    isFeatured: true,
  },

  // Materiais de Espanhol
  {
    id: 'es-1',
    title: 'Fundamentos da Gramática Espanhola (Nível A1-A2)',
    description: 'Aprenda os pilares da gramática espanhola com explicações claras e exemplos práticos.',
    type: 'PDF',
    category: 'Espanhol',
    link: '#',
    isFeatured: true,
  },
  {
    id: 'es-2',
    title: 'Conversação em Espanhol para Iniciantes: Situações Reais',
    description: 'Série de vídeos interativos para desenvolver suas habilidades de conversação em espanhol.',
    type: 'Video',
    category: 'Espanhol',
    link: '#',
    isFeatured: false,
  },
  {
    id: 'es-3',
    title: 'Guia de Expressões Idiomáticas em Espanhol',
    description: 'Descubra as expressões mais usadas no dia a dia para soar como um nativo.',
    type: 'Artigo',
    category: 'Espanhol',
    link: '#',
    isFeatured: false,
  },
  {
    id: 'es-4',
    title: 'Cultura Hispânica: Costumes e Curiosidades',
    description: 'Um panorama sobre a diversidade cultural dos países de língua espanhola.',
    type: 'Artigo',
    category: 'Cultura Hispânica',
    link: '#',
    isFeatured: true,
  },
  {
    id: 'es-5',
    title: 'Áudios para Treino de Escuta em Espanhol (Nível B2)',
    description: 'Coleção de áudios com diferentes sotaques para aprimorar sua compreensão auditiva.',
    type: 'Audio', // Novo tipo
    category: 'Espanhol',
    link: '#',
    isFeatured: false,
  },

  // Materiais Gerais (pode ser adaptado para ambos os idiomas ou temas comuns)
  {
    id: 'gen-1',
    title: 'Dicas para Aprender um Novo Idioma Rapidamente',
    description: 'Estratégias e técnicas comprovadas para acelerar seu processo de aprendizado de idiomas.',
    type: 'Artigo',
    category: 'Dicas de Estudo',
    link: '#',
    isFeatured: false,
  },
];

const MateriaisDeEnsino = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [allMaterials, setAllMaterials] = useState<Material[]>(initialMockMaterials); // Novo estado para todos os materiais
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialDescription, setNewMaterialDescription] = useState('');
  const { toast } = useToast(); // Hook para exibir notificações

  // Refs para os inputs de arquivo ocultos
  const fileInputPdfRef = useRef<HTMLInputElement>(null);
  const fileInputXlsRef = useRef<HTMLInputElement>(null);
  const fileInputDocRef = useRef<HTMLInputElement>(null);

  // Garante que 'Todos' seja a primeira opção e adiciona as categorias únicas dos materiais
  const categories = ['Todos', ...new Set(allMaterials.map(material => material.category))];

  const filteredMaterials = allMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Todos' || material.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Função para retornar o ícone correto baseado no tipo de material
  const getIconForType = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-6 h-6 text-orange-500" />;
      case 'Video':
        return <Video className="w-6 h-6 text-blue-500" />;
      case 'Planilha': // Mantendo para caso haja planilhas de estudo
        return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
      case 'Artigo':
        return <BookOpen className="w-6 h-6 text-purple-500" />;
      case 'Audio':
        return <Mic className="w-6 h-6 text-red-500" />; // Usando Mic para áudio
      case 'DOC': // Para arquivos DOC (Word)
        return <FileDoc className="w-6 h-6 text-indigo-500" />;
      case 'XLS': // Para arquivos XLS (Excel)
        return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
      default:
        return <Link className="w-6 h-6 text-gray-500" />;
    }
  };

  // Função para lidar com o upload de arquivos
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = event.target.files?.[0];

    if (!newMaterialTitle.trim() || !newMaterialDescription.trim()) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha o Título e a Descrição do material antes de enviar.",
        variant: "destructive",
      });
      // Limpa o valor do input de arquivo para permitir que o usuário selecione o mesmo arquivo novamente
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    if (file) {
      toast({
        title: `Upload de ${fileType}`,
        description: `Iniciando upload de "${file.name}"...`,
      });

      // Simula o processo de upload (em uma aplicação real, você enviaria o arquivo para um backend aqui)
      setTimeout(() => {
        const newMaterial: Material = {
          id: Date.now().toString(), // ID único baseado no timestamp
          title: newMaterialTitle,
          description: newMaterialDescription,
          type: fileType,
          category: 'Uploads', // Categoria padrão para materiais enviados
          link: URL.createObjectURL(file), // Cria uma URL temporária para o arquivo (apenas para simulação de download)
          isFeatured: false, // Materiais enviados não são destacados por padrão
        };

        setAllMaterials(prevMaterials => [...prevMaterials, newMaterial]); // Adiciona o novo material à lista
        setNewMaterialTitle(''); // Limpa o título
        setNewMaterialDescription(''); // Limpa a descrição
        if (event.target) {
          event.target.value = ''; // Limpa o valor do input de arquivo
        }

        toast({
          title: `Upload de ${fileType} Concluído`,
          description: `"${file.name}" foi enviado com sucesso e está agora disponível!`,
          variant: "success", // Assume que você tem uma variante 'success' no seu sistema de toast
        });
      }, 2000); // Simula 2 segundos de upload
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16"> {/* Adiciona margin-top para não sobrepor o header fixo */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            📚 Seus Materiais de Ensino de Idiomas
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore nossa vasta biblioteca de recursos para aprender Português e Espanhol de forma eficaz.
          </p>
        </div>

        {/* Seção de Busca e Filtro */}
        <Card className="mb-8 p-6 shadow-md rounded-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">Encontre o que precisa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 text-gray-500" />
              <Input
                placeholder="Pesquisar materiais..."
                className="flex-grow border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={filterCategory === category ? 'default' : 'outline'}
                  className={filterCategory === category ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600'}
                  onClick={() => setFilterCategory(category)}
                >
                  <Tag className="w-4 h-4 mr-2" /> {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seção de Upload de Materiais */}
        <Card className="mb-8 p-6 shadow-md rounded-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">Upload de Novos Materiais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Envie novos materiais didáticos nos formatos PDF, XLS ou DOC.</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="material-title">Título do Material</Label>
                <Input
                  id="material-title"
                  placeholder="Ex: Guia de Conversação Avançada"
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="material-description">Descrição do Material</Label>
                <Input
                  id="material-description"
                  placeholder="Breve descrição do conteúdo do material."
                  value={newMaterialDescription}
                  onChange={(e) => setNewMaterialDescription(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-4">
              {/* Botão para PDF */}
              <Button onClick={() => fileInputPdfRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="w-4 h-4 mr-2" /> Upload PDF
                <input
                  type="file"
                  ref={fileInputPdfRef}
                  onChange={(e) => handleFileUpload(e, 'PDF')}
                  accept=".pdf"
                  className="hidden"
                />
              </Button>

              {/* Botão para XLS */}
              <Button onClick={() => fileInputXlsRef.current?.click()} className="bg-green-600 hover:bg-green-700 text-white">
                <Upload className="w-4 h-4 mr-2" /> Upload XLS
                <input
                  type="file"
                  ref={fileInputXlsRef}
                  onChange={(e) => handleFileUpload(e, 'XLS')}
                  accept=".xls,.xlsx"
                  className="hidden"
                />
              </Button>

              {/* Botão para DOC */}
              <Button onClick={() => fileInputDocRef.current?.click()} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Upload className="w-4 h-4 mr-2" /> Upload DOC
                <input
                  type="file"
                  ref={fileInputDocRef}
                  onChange={(e) => handleFileUpload(e, 'DOC')}
                  accept=".doc,.docx"
                  className="hidden"
                />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Materiais em Destaque */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🌟 Materiais em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredMaterials.filter(m => m.isFeatured).map(material => (
            <Card key={material.id} className="shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 border border-orange-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-lg text-sm font-semibold flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-yellow-300" /> Destaque
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold text-gray-900">{material.title}</CardTitle>
                {getIconForType(material.type)}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">{material.description}</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                    Categoria: {material.category}
                  </span>
                  <Button variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                    onClick={() => { if (material.link) window.open(material.link, '_blank'); }}>
                    <Download className="w-4 h-4 mr-2" /> Ver Material
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Todos os Materiais */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">📚 Todos os Materiais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map(material => (
            <Card key={material.id} className="shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900">{material.title}</CardTitle>
                {getIconForType(material.type)}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">{material.description}</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                    Categoria: {material.category}
                  </span>
                  <Button variant="outline" size="sm" className="border-gray-400 text-gray-700 hover:bg-gray-50 hover:text-gray-800"
                    onClick={() => { if (material.link) window.open(material.link, '_blank'); }}>
                    <Download className="w-4 h-4 mr-2" /> Ver Material
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredMaterials.length === 0 && (
            <p className="col-span-full text-center text-gray-500 text-lg">Nenhum material encontrado para sua pesquisa/filtro.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MateriaisDeEnsino;
