import { MessageCircle, Mail, Facebook } from 'lucide-react';
import { getWhatsAppLink, getGmailLink, getFacebookLink } from '../../utils/contactLinks';

export default function ContactButtons({ produit }) {
  if (!produit) return null;

  const links = [
    { href: getWhatsAppLink(produit), label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-600' },
    { href: getGmailLink(produit), label: 'Gmail', icon: Mail, color: 'bg-red-600' },
    { href: getFacebookLink(produit), label: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {links.map(({ href, label, icon: Icon, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm ${color} hover:opacity-90 transition-opacity`}
        >
          <Icon size={18} />
          {label}
        </a>
      ))}
    </div>
  );
}
