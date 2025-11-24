import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { Users, Copy, Mail, Facebook, Twitter, Linkedin, CheckCircle2, Gift } from 'lucide-react';

// ReferralStats component for real data
function ReferralStats({ userId }: { userId: string }) {
  const [stats, setStats] = useState({ invited: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferralStats = async () => {
      try {
        let token = localStorage.getItem('token');
        
        if (!token) {
          try {
            const session = localStorage.getItem('infera_session');
            if (session) {
              const sessionData = JSON.parse(session);
              token = sessionData.accessToken;
            }
          } catch (e) {
            console.error('Error getting token:', e);
          }
        }

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/users/referral-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setStats({
            invited: data.totalInvited || 0,
            earnings: data.totalEarnings || 0
          });
        }
      } catch (error) {
        console.error('Error fetching referral stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && userId !== 'unknown') {
      fetchReferralStats();
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 pt-4 border-t">
        <div className="text-center">
          <p className="text-2xl text-gray-400">...</p>
          <p className="text-xs text-gray-600">Friends Invited</p>
        </div>
        <div className="text-center">
          <p className="text-2xl text-gray-400">...</p>
          <p className="text-xs text-gray-600">Earned from Referrals</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 pt-3 border-t mt-3">
      <div className="text-center">
        <p className="text-xl text-gray-900">{stats.invited}</p>
        <p className="text-xs text-gray-600">Friends Invited</p>
      </div>
      <div className="text-center">
        <p className="text-xl text-green-600">${stats.earnings}</p>
        <p className="text-xs text-gray-600">Earned from Referrals</p>
      </div>
    </div>
  );
}

interface InviteFriendsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteFriendsDialog({ open, onOpenChange }: InviteFriendsDialogProps) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  // Get real user data for referral system
  const getUserReferralData = () => {
    try {
      const session = localStorage.getItem('infera_session');
      if (session) {
        const sessionData = JSON.parse(session);
        const userId = sessionData.user?.id || 'unknown';
        const userEmail = sessionData.user?.email || 'user';
        const referralCode = userEmail.split('@')[0].toUpperCase() + userId.slice(-4);
        return {
          code: referralCode,
          link: `https://inferaai.com/join?ref=${referralCode}`,
          userId
        };
      }
    } catch (e) {
      console.error('Error getting user data:', e);
    }
    return {
      code: 'USER' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      link: 'https://inferaai.com/join?ref=DEFAULT',
      userId: 'unknown'
    };
  };
  
  const { code: referralCode, link: referralLink, userId } = getUserReferralData();

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
      // Get authentication token
      let token = localStorage.getItem('token');
      
      if (!token) {
        try {
          const session = localStorage.getItem('infera_session');
          if (session) {
            const sessionData = JSON.parse(session);
            token = sessionData.accessToken;
          }
        } catch (e) {
          console.error('Error getting token:', e);
        }
      }
      
      if (!token) {
        toast.error('Authentication required to send invites');
        return;
      }
      
      // Send real invite via backend
      const response = await fetch('http://localhost:5000/api/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          referralCode,
          invitedBy: userId
        })
      });
      
      if (response.ok) {
        toast.success(`Invitation sent to ${email}!`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to send invitation');
      }
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
      <DialogContent className="max-w-[90vw] sm:max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Invite Friends & Earn Rewards
          </DialogTitle>
          <DialogDescription>
            Share Infera AI with friends and earn bonuses when they join
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          {/* Rewards Info */}
          <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-4 w-4 text-purple-600" />
              <h4 className="text-sm text-purple-900">Referral Rewards</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-center p-2 bg-white rounded-md border border-purple-200">
                <p className="text-lg text-purple-600">$50</p>
                <p className="text-xs text-gray-600">For you</p>
              </div>
              <div className="text-center p-2 bg-white rounded-md border border-purple-200">
                <p className="text-lg text-purple-600">$50</p>
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
          <div className="space-y-1">
            <Label className="text-sm">Referral Code</Label>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1 text-sm">
                {referralCode}
              </Badge>
              <Button onClick={handleCopyCode} variant="ghost" size="sm" className="gap-1 text-xs">
                <Copy className="h-3 w-3" />
                Copy Code
              </Button>
            </div>
          </div>

          {/* Email Invite */}
          <form onSubmit={handleSendInvite} className="space-y-1">
            <Label className="text-sm">Send Invitation via Email</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
                className="flex-1 text-sm"
              />
              <Button type="submit" className="gap-1 text-sm">
                <Mail className="h-3 w-3" />
                Send
              </Button>
            </div>
          </form>

          {/* Social Share */}
          <div className="space-y-1">
            <Label className="text-sm">Share on Social Media</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => handleShareSocial('facebook')}
                className="gap-1 text-xs px-2 py-1"
                size="sm"
              >
                <Facebook className="h-3 w-3" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShareSocial('twitter')}
                className="gap-1 text-xs px-2 py-1"
                size="sm"
              >
                <Twitter className="h-3 w-3" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShareSocial('linkedin')}
                className="gap-1 text-xs px-2 py-1"
                size="sm"
              >
                <Linkedin className="h-3 w-3" />
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Real Stats */}
          <ReferralStats userId={userId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
