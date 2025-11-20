import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import Layout from '@components/Layout';

export default function UserPage() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, postId: null, postTitle: '' });
  const [logoutModal, setLogoutModal] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/login');
    } else {
      fetchUserPosts(1, false);
    }
  }, [user, router]);

  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Trigger when user is 200px from bottom
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        fetchUserPosts(currentPage + 1, true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, currentPage]);

  const fetchUserPosts = async (page = 1, append = false) => {
    if (!user?.username) return;

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch(
        `/api/search?author=${encodeURIComponent(user.username)}&limit=100&page=${page}`
      );
      const data = await response.json();

      if (response.ok) {
        const newPosts = data.data || [];
        if (append) {
          setPosts(prev => [...prev, ...newPosts]);
        } else {
          setPosts(newPosts);
        }
        setTotalPosts(data.pagination?.total || 0);
        setCurrentPage(page);
        setHasMore(page < (data.pagination?.total_pages || 1));
      } else {
        console.error('Failed to fetch user posts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLogout = async () => {
    setLogoutModal(false);
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        setUser(null);
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const openDeleteModal = (postId, postTitle) => {
    setDeleteModal({ show: true, postId, postTitle });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, postId: null, postTitle: '' });
  };

  const confirmDelete = async () => {
    const postId = deleteModal.postId;
    closeDeleteModal();

    try {
      const response = await fetch(`/api/posts/${postId}/delete`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        // Remove the post from the list
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        alert(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <Layout title="Profile" description="Your GW2Style profile">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.9), rgba(36, 41, 56, 0.9))',
          border: '2px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '12px',
          padding: '1.5rem',
          position: 'relative',
          marginBottom: '2rem',
        }}>
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            color: '#d4af37',
            fontSize: '1rem',
            opacity: 0.6,
          }}>◆</div>
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: '#d4af37',
            fontSize: '1rem',
            opacity: 0.6,
          }}>◆</div>

          {/* Logout button in top right corner */}
          <button
            onClick={() => setLogoutModal(true)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '6px',
              color: '#dc2626',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(220, 38, 38, 0.2)';
              e.target.style.borderColor = 'rgba(220, 38, 38, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(220, 38, 38, 0.1)';
              e.target.style.borderColor = 'rgba(220, 38, 38, 0.3)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.5rem',
            marginTop: '0.5rem',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #d4af37, #cd7f32)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid rgba(212, 175, 55, 0.5)',
              boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)',
              flexShrink: 0,
            }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0a0e1a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '1.75rem',
                color: '#d4af37',
                marginBottom: '0.25rem',
              }}>
                {user.username}
              </h2>
              
              {!loading && (
                <p style={{
                  color: '#a8a29e',
                  fontSize: '0.875rem',
                }}>
                  {totalPosts} {totalPosts === 1 ? 'post' : 'posts'} created
                </p>
              )}
            </div>
          </div>
        </div>

        {/* User Posts Section */}
        <div>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.75rem',
            color: '#d4af37',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}>
            My Posts
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a8a29e' }}>
              Loading your posts...
            </div>
          ) : posts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              background: 'rgba(26, 31, 46, 0.5)',
              borderRadius: '12px',
              border: '2px solid rgba(212, 175, 55, 0.2)',
            }}>
              <p style={{ color: '#a8a29e', fontSize: '1.125rem', marginBottom: '1rem' }}>
                You haven't created any posts yet
              </p>
              <button
                onClick={() => router.push('/create')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #d4af37, #cd7f32)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#0a0e1a',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
            }}>
              {posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.9), rgba(36, 41, 56, 0.9))',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(212, 175, 55, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Thumbnail */}
                  {post.thumbnail && (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid rgba(212, 175, 55, 0.3)',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      onClick={() => router.push(`/posts/${post.id}`)}
                    />
                  )}

                  {/* Post Info and Actions */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: 0 }}>
                    <div>
                      <h3 style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '1.125rem',
                        color: '#d4af37',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      onClick={() => router.push(`/posts/${post.id}`)}
                      >
                        {post.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#78716c' }}>
                        <span>❤️ {post.likes_count || 0}</span>
                        <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => router.push(`/posts/${post.id}`)}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.75rem',
                          background: 'linear-gradient(135deg, #d4af37, #cd7f32)',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#0a0e1a',
                          fontFamily: "'Rajdhani', sans-serif",
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => alert('Edit feature is not ready yet. Coming soon!')}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.75rem',
                          background: 'rgba(168, 162, 158, 0.2)',
                          border: '1px solid rgba(168, 162, 158, 0.3)',
                          borderRadius: '6px',
                          color: '#a8a29e',
                          fontFamily: "'Rajdhani', sans-serif",
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(168, 162, 158, 0.3)';
                          e.target.style.borderColor = 'rgba(168, 162, 158, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(168, 162, 158, 0.2)';
                          e.target.style.borderColor = 'rgba(168, 162, 158, 0.3)';
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(post.id, post.title)}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.75rem',
                          background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#fff',
                          fontFamily: "'Rajdhani', sans-serif",
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Loading More Indicator */}
          {loadingMore && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#d4af37',
              fontSize: '1rem',
            }}>
              Loading more posts...
            </div>
          )}

          {/* No More Posts Indicator */}
          {!loading && !loadingMore && !hasMore && posts.length > 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#78716c',
              fontSize: '0.875rem',
            }}>
              No more posts to load
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {logoutModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setLogoutModal(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.98), rgba(36, 41, 56, 0.98))',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1rem',
                background: 'linear-gradient(135deg, #d4af37, #cd7f32)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}>
                👋
              </div>
              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '1.5rem',
                color: '#d4af37',
                marginBottom: '0.5rem',
              }}>
                Logout?
              </h3>
              <p style={{
                color: '#a8a29e',
                fontSize: '1rem',
              }}>
                Are you sure you want to logout?
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: '0.875rem 1.5rem',
                  background: 'rgba(168, 162, 158, 0.2)',
                  border: '2px solid rgba(168, 162, 158, 0.3)',
                  borderRadius: '8px',
                  color: '#a8a29e',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(168, 162, 158, 0.3)';
                  e.target.style.borderColor = 'rgba(168, 162, 158, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(168, 162, 158, 0.2)';
                  e.target.style.borderColor = 'rgba(168, 162, 158, 0.3)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: '0.875rem 1.5rem',
                  background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                  border: '2px solid #ef4444',
                  borderRadius: '8px',
                  color: '#fff',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={closeDeleteModal}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.98), rgba(36, 41, 56, 0.98))',
              border: '2px solid rgba(220, 38, 38, 0.5)',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1rem',
                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
              }}>
                ⚠️
              </div>
              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '1.5rem',
                color: '#dc2626',
                marginBottom: '0.5rem',
              }}>
                Delete Post?
              </h3>
              <p style={{
                color: '#a8a29e',
                fontSize: '1rem',
                marginBottom: '0.5rem',
              }}>
                Are you sure you want to delete
              </p>
              <p style={{
                color: '#d4af37',
                fontSize: '1.125rem',
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
              }}>
                "{deleteModal.postTitle}"
              </p>
              <p style={{
                color: '#78716c',
                fontSize: '0.875rem',
                marginTop: '1rem',
              }}>
                This action cannot be undone.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={closeDeleteModal}
                style={{
                  flex: 1,
                  padding: '0.875rem 1.5rem',
                  background: 'rgba(168, 162, 158, 0.2)',
                  border: '2px solid rgba(168, 162, 158, 0.3)',
                  borderRadius: '8px',
                  color: '#a8a29e',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(168, 162, 158, 0.3)';
                  e.target.style.borderColor = 'rgba(168, 162, 158, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(168, 162, 158, 0.2)';
                  e.target.style.borderColor = 'rgba(168, 162, 158, 0.3)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  flex: 1,
                  padding: '0.875rem 1.5rem',
                  background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                  border: '2px solid #ef4444',
                  borderRadius: '8px',
                  color: '#fff',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
