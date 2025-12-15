import React from 'react';
import RevealOnScroll from './RevealOnScroll';

const Contact = () => {
    const styles = {
        section: {
            padding: '100px 0',
            background: 'var(--color-surface)',
            borderTop: '1px solid #222',
        },
        container: {
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
            padding: '0 20px',
        },
        form: {
            marginTop: '50px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        },
        inputGroup: {
            display: 'flex',
            gap: '20px',
        },
        input: {
            flex: 1,
            padding: '15px',
            background: 'var(--color-bg)',
            border: '1px solid #333',
            color: '#fff',
            fontFamily: 'var(--font-body)',
        },
        textarea: {
            padding: '15px',
            background: 'var(--color-bg)',
            border: '1px solid #333',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            minHeight: '150px',
            resize: 'vertical',
        },
        footer: {
            marginTop: '100px',
            paddingTop: '50px',
            borderTop: '1px solid #222',
            color: '#666',
            fontSize: '0.9rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        socials: {
            display: 'flex',
            gap: '20px',
        },
        socialLink: {
            color: '#fff',
            fontSize: '1.2rem',
        }
    };

    return (
        <section id="contact" style={styles.section}>
            <div style={styles.container}>
                <RevealOnScroll>
                    <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', marginBottom: '20px' }}>
                        INITIATE <span style={{ color: 'var(--color-primary)' }}>CONNECTION</span>
                    </h2>
                    <p style={{ color: '#888', marginBottom: '40px' }}>
                        Ready to engineer the future? Reach out for collaborations or inquiries.
                    </p>
                </RevealOnScroll>

                <RevealOnScroll delay={0.2}>
                    <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
                        <div style={styles.inputGroup}>
                            <input type="text" placeholder="NAME" style={styles.input} />
                            <input type="email" placeholder="EMAIL" style={styles.input} />
                        </div>
                        <input type="text" placeholder="SUBJECT" style={styles.input} />
                        <textarea placeholder="MESSAGE" style={styles.textarea}></textarea>
                        <button type="submit" className="btn" style={{ marginTop: '20px', maxWidth: '200px', margin: '20px auto' }}>
                            Send Message
                        </button>
                    </form>
                </RevealOnScroll>

                <div style={styles.footer}>
                    <span>&copy; {new Date().getFullYear()} Rohan Kadam. All Rights Reserved.</span>
                    <div style={styles.socials}>
                        <a href="#" style={styles.socialLink}>LN</a>
                        <a href="#" style={styles.socialLink}>GH</a>
                        <a href="#" style={styles.socialLink}>TW</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
