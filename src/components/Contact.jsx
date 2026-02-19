import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import GlitchText from './GlitchText';

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
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
        }
    };

    return (
        <section id="contact" style={styles.section}>
            <div style={styles.container}>
                <RevealOnScroll>
                    <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', marginBottom: '20px' }}>
                        <GlitchText text="INITIATE" /> <span style={{ color: 'var(--color-primary)' }}>CONNECTION</span>
                    </h2>
                    <p style={{ color: '#888', marginBottom: '40px' }}>
                        Ready to engineer the future? Reach out for collaborations or inquiries.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ padding: '20px', background: 'var(--color-bg)', border: '1px solid #333', borderRadius: '4px' }}>
                            <i className="fas fa-phone" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', marginBottom: '10px' }}></i>
                            <h3 style={{ color: '#fff', marginBottom: '5px' }}>Phone</h3>
                            <a href="tel:+919673475039" style={{ color: '#bbb', textDecoration: 'none' }}>+91 96734 75039</a>
                        </div>
                        <div style={{ padding: '20px', background: 'var(--color-bg)', border: '1px solid #333', borderRadius: '4px' }}>
                            <i className="fas fa-envelope" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', marginBottom: '10px' }}></i>
                            <h3 style={{ color: '#fff', marginBottom: '5px' }}>Email</h3>
                            <a href="mailto:rohankadam.1023@gmail.com" style={{ color: '#bbb', textDecoration: 'none', wordBreak: 'break-all', display: 'block' }}>rohankadam.1023@gmail.com</a>
                        </div>
                        <div style={{ padding: '20px', background: 'var(--color-bg)', border: '1px solid #333', borderRadius: '4px' }}>
                            <i className="fas fa-map-marker-alt" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', marginBottom: '10px' }}></i>
                            <h3 style={{ color: '#fff', marginBottom: '5px' }}>Location</h3>
                            <span style={{ color: '#bbb' }}>Pune, India</span>
                        </div>
                    </div>

                    <a href={`${import.meta.env.BASE_URL}Rohan_Kadam_Resume_v2.docx`} download className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', margin: '0 0 40px 0' }}>
                        <i className="fas fa-download"></i> Download Resume
                    </a>
                </RevealOnScroll>

                <RevealOnScroll delay={0.2}>
                    <form style={styles.form} onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const name = formData.get('name');
                        const email = formData.get('email');
                        const message = formData.get('message');

                        const fullMessage = `Hi Rohan,\n\n${message}\n\nBest,\n${name}\n(${email})`;

                        navigator.clipboard.writeText(fullMessage).then(() => {
                            alert("Message copied to clipboard! Redirecting to LinkedIn...");
                            window.open("https://www.linkedin.com/in/rohan-kadam-7bb932161/", "_blank");
                        });
                    }}>
                        <div style={styles.inputGroup}>
                            <input name="name" type="text" placeholder="NAME" style={styles.input} required />
                            <input name="email" type="email" placeholder="EMAIL" style={styles.input} required />
                        </div>
                        <input name="subject" type="text" placeholder="SUBJECT" style={styles.input} />
                        <textarea name="message" placeholder="MESSAGE" style={styles.textarea} required></textarea>
                        <button type="submit" className="btn" style={{ marginTop: '20px', maxWidth: '200px', margin: '20px auto' }}>
                            Send Message on LinkedIn
                        </button>
                    </form>
                </RevealOnScroll>

                <div style={styles.footer}>
                    <span>&copy; {new Date().getFullYear()} Rohan Kadam. All Rights Reserved.</span>
                    <div style={styles.socials}>
                        <a href="https://www.linkedin.com/in/rohan-kadam-7bb932161/" target="_blank" rel="noopener noreferrer" style={styles.socialLink}><i className="fab fa-linkedin"></i> LinkedIn</a>
                        <a href="https://github.com/rohaaaaaan" target="_blank" rel="noopener noreferrer" style={styles.socialLink}><i className="fab fa-github"></i> GitHub</a>
                        <a href="mailto:rohankadam.1023@gmail.com" style={styles.socialLink}><i className="fas fa-envelope"></i> Email</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
