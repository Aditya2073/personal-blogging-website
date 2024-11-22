import React from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Twitter, Facebook, Linkedin, Link2 } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, description = '' }) => {
  const { darkMode } = React.useContext(ThemeContext);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // TODO: Show success toast
    } catch (err) {
      console.error('Failed to copy:', err);
      // TODO: Show error toast
    }
  };

  const buttonClasses = `p-2 rounded-lg transition-transform hover:scale-110 ${
    darkMode
      ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
  }`;

  return (
    <div className="flex items-center gap-2">
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClasses} hover:text-[#1DA1F2]`}
        title="Share on Twitter"
      >
        <Twitter size={20} />
      </a>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClasses} hover:text-[#4267B2]`}
        title="Share on Facebook"
      >
        <Facebook size={20} />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClasses} hover:text-[#0077B5]`}
        title="Share on LinkedIn"
      >
        <Linkedin size={20} />
      </a>
      <button
        onClick={copyToClipboard}
        className={buttonClasses}
        title="Copy link"
      >
        <Link2 size={20} />
      </button>
    </div>
  );
};

export default ShareButtons;
