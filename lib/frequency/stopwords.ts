// Standard Indonesian & English Stopwords for frequency filtering
export const STOPWORDS_ID = new Set([
  'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'pada', 'adalah', 'ini', 'itu',
  'dengan', 'atau', 'sebagai', 'oleh', 'dalam', 'akan', 'juga', 'bisa', 'ada',
  'tidak', 'saat', 'sudah', 'lebih', 'karena', 'kami', 'kita', 'anda', 'kamu',
  'saya', 'mereka', 'ia', 'dia', 'saja', 'secara', 'harus', 'lagi', 'pun',
  'hanya', 'antara', 'tanpa', 'bagi', 'tentang', 'setiap', 'banyak', 'serta',
  'satu', 'dua', 'tiga', 'para', 'bila', 'jika', 'agar', 'supaya', 'seperti',
  'hingga', 'sampai', 'lalu', 'kemudian', 'namun', 'tetapi', 'yakni', 'yaitu',
  'bahkan', 'selalu', 'dapat', 'menjadi', 'tersebut', 'lah', 'kah', 'punya',
  'lain', 'sangat', 'maka', 'telah', 'sedang', 'atas', 'bawah', 'luar', 'pula',
  'begitu', 'semua', 'kalian', 'beliau', 'diri', 'sama', 'hal', 'mana', 'kapan',
  'siapa', 'mengapa', 'bagaimana', 'berapa', 'ikut', 'pasti', 'belum', 'tiap',
]);

export const STOPWORDS_EN = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should',
  'can', 'could', 'may', 'might', 'must', 'that', 'which', 'who', 'whom', 'this',
  'these', 'those', 'it', 'its', 'they', 'them', 'their', 'we', 'us', 'our',
  'you', 'your', 'he', 'him', 'his', 'she', 'her', 'i', 'me', 'my', 'mine',
  'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around',
  'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond',
  'during', 'except', 'inside', 'into', 'near', 'off', 'onto', 'out', 'outside',
  'over', 'through', 'throughout', 'toward', 'under', 'underneath', 'until',
  'up', 'upon', 'within', 'without', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'just', 'now', 'then', 'here', 'there', 'when',
  'where', 'why', 'how', 'again', 'further', 'once', 'also', 'get', 'got',
]);

export function isStopword(word: string): boolean {
  const w = word.toLowerCase().trim();
  return STOPWORDS_ID.has(w) || STOPWORDS_EN.has(w);
}
