import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { Users, Copy, Mail, Facebook, Twitter, Linkedin, CheckCircle2, Gift } from 'lucide-react';

interface InviteFriendsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteFriendsDialog({ open, onOpenChange }: InviteFriendsDialogProps) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://inferaai.com/join?ref=USER123';
  const referralCode = 'USER123';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Invitation sent to ${email}!`);
      setEmail('');
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  const handleShareSocial = (platform: string) => {
    const text = encodeURIComponent('Join me on Infera AI and earn money by training AI models!');
    const url = encodeURIComponent(referralLink);
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Invite Friends & Earn Rewards
          </DialogTitle>
          <DialogDescription>
            Share Infera AI with friends and earn bonuses when they join
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Rewards Info */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-5 w-5 text-purple-600" />
              <h4 className="text-sm text-purple-900">Referral Rewards</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                <p className="text-2xl text-purple-600">$50</p>
                <p className="text-xs text-gray-600">For you</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                <p className="text-2xl text-purple-600">$50</p>
                <p className="text-xs text-gray-600">For your friend</p>
              </div>
            </div>
            <p className="text-xs text-purple-700 mt-2">
              Both of you get $50 when they complete their first task!
            </p>
          </div>

          {/* Referral Link */}
          <div className="space-y-2">
            <Label>Your Referral Link</Label>
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="flex-1"
              />
              <Button onClick={handleCopyLink} variant="outline" className="gap-2">
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Referral Code */}
          <div className="space-y-2">
            <Label>Referral Code</Label>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
                {referralCode}
              </Badge>
              <Button onClick={handleCopyCode} variant="ghost" size="sm" className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Code
              </Button>
            </div>
          </div>

          {/* Email Invite */}
          <form onSubmit={handleSendInvite} className="space-y-2">
            <Label>Send Invitation via Email</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
                className="flex-1"
              />
              <Button type="submit" className="gap-2">
                <Mail className="h-4 w-4" />
                Send
              </Button>
            </div>
          </form>

          {/* Social Share */}
          <div className="space-y-2">
            <Label>Share on Social Media</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleShareSocial('facebook')}
                className="flex-1 gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShareSocial('twitter')}
                className="flex-1 gap-2"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShareSocial('linkedin')}
                className="flex-1 gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl text-gray-900">12</p>
              <p className="text-xs text-gray-600">Friends Invited</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-green-600">$350</p>
              <p className="text-xs text-gray-600">Earned from Referrals</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
