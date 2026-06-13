import React, { useState } from 'react';
import RevealOnScroll from './RevealOnScroll';
import GlitchText from './GlitchText';

const Contact = () => {
    const [isSending, setIsSending] = useState(false);
    const [transmissionStatus, setTransmissionStatus] = useState('');

    const styles = {
        section: {
            padding: '100px 0',
            background: 'var(--color-surface)',
            borderTop: '1px solid rgba(255, 255, 255, 0.03)',
        },
        container: {
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 20px',
        },
        contactGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '50px',
        },
        card: {
            padding: '25px',
            background: 'var(--color-bg)',
            border: '1px solid rgba(255, 255, 255, 0.03)',
            borderRadius: '2px',
            textAlign: 'center',
            position: 'relative',
        },
        cardIcon: {
            color: 'var(--color-primary)',
            fontSize: '1.4rem',
            marginBottom: '15px',
            display: 'block',
        },
        cardTitle: {
            fontSize: '0.85rem',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '1px',
            color: '#fff',
            marginBottom: '8px',
        },
        cardValue: {
            color: 'var(--color-text-muted)',
            fontSize: '0.9rem',
            textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
            transition: 'color 0.2s ease',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            background: 'var(--color-bg)',
            padding: '40px',
            border: '1px solid rgba(255,255,255,0.03)',
            borderRadius: '4px',
        },
        inputGroup: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
        },
        input: {
            width: '100%',
            minWidth: '0',
            padding: '14px 18px',
            background: 'var(--color-bg)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            borderRadius: '2px',
            outline: 'none',
            transition: 'border-color 0.2s ease',
        },
        textarea: {
            width: '100%',
            padding: '14px 18px',
            background: 'var(--color-bg)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            borderRadius: '2px',
            minHeight: '130px',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s ease',
        },
        statusPanel: {
            background: 'var(--color-surface)',
            borderLeft: '4px solid var(--color-secondary)',
            padding: '12px 20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--color-secondary)',
            marginBottom: '20px',
            letterSpacing: '1px',
        },
        footer: {
            marginTop: '80px',
            paddingTop: '40px',
            borderTop: '1px solid rgba(255,255,255,0.03)',
            color: 'var(--color-text-muted)',
            fontSize: '0.8rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '1px',
        },
        socials: {
            display: 'flex',
            gap: '25px',
        },
        socialLink: {
            color: '#b2b2c2',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
            fontWeight: 'bold',
        }
    };

    return (
        <section id="contact" style={styles.section}>
            <div style={styles.container}>
                <RevealOnScroll>
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', marginBottom: '15px' }}>
                            <GlitchText text="PIT WALL RADIO" /> <span style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}>UPLINK</span>
                        </h2>
                        <p style={{ color: 'var(--color-text-muted)', maxWidth: '550px', margin: '0 auto', fontSize: '0.95rem' }}>
                            Establish communication channel. Send driver queries, system configurations, or collaboration briefs.
                        </p>
                    </div>

                    <div style={styles.contactGrid}>
                        <div style={styles.card} className="contact-box">
                            <i className="fas fa-phone" style={styles.cardIcon}></i>
                            <h3 style={styles.cardTitle}>VOICE UPLINK</h3>
                            <a href="tel:+919673475039" style={styles.cardValue} className="link-hover">+91 96734 75039</a>
                        </div>

                        <div style={styles.card} className="contact-box">
                            <i className="fas fa-envelope" style={styles.cardIcon}></i>
                            <h3 style={styles.cardTitle}>PACKET SMTP</h3>
                            <a href="mailto:rohankadam.1023@gmail.com" style={styles.cardValue} className="link-hover">rohankadam.1023@gmail.com</a>
                        </div>

                        <div style={styles.card} className="contact-box">
                            <i className="fas fa-map-marker-alt" style={styles.cardIcon}></i>
                            <h3 style={styles.cardTitle}>BASE COORDINATES</h3>
                            <span style={{ ...styles.cardValue, color: '#fff' }}>PUNE, MH, IN</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                        <a
                            href={`${import.meta.env.BASE_URL}Rohan%20Kadam%20Systems%20Engineer.pdf`}
                            download="Rohan Kadam Systems Engineer.pdf"
                            className="btn f1-skew-btn"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                        >
                            <span><i className="fas fa-download"></i> DOWNLOAD RESUME (PDF)</span>
                        </a>
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.15}>
                    <form
                        style={styles.form}
                        className="contact-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setIsSending(true);

                            const formData = new FormData(e.target);
                            const name = formData.get('name');
                            const email = formData.get('email');
                            const message = formData.get('message');
                            const subject = formData.get('subject') || 'Portfolio Query';

                            const fullMessage = `Hi Rohan,\n\nSubject: ${subject}\n\nMessage: ${message}\n\nBest,\n${name}\n(${email})`;

                            navigator.clipboard.writeText(fullMessage).then(() => {
                                setTransmissionStatus('PIT TO CAR: DATA DECAPSULATED & COPIED TO CLIPOARD. REDIRECTING LINKEDIN INTERFACE...');
                                setTimeout(() => {
                                    window.open("https://www.linkedin.com/in/rohan-kadam-7bb932161/", "_blank");
                                    setIsSending(false);
                                }, 1800);
                            });
                        }}
                    >
                        {transmissionStatus && (
                            <div style={styles.statusPanel} className="animate-fade-in">
                                <span className="f1-led-light f1-led-green" style={{ marginRight: '10px' }} />
                                {transmissionStatus}
                            </div>
                        )}

                        <div style={styles.inputGroup} className="form-input-grid">
                            <input
                                name="name"
                                type="text"
                                placeholder="COMMUNICATION SIGNATURE (NAME)"
                                style={styles.input}
                                className="contact-input"
                                required
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="REPLY PACKET ADDRESS (EMAIL)"
                                style={styles.input}
                                className="contact-input"
                                required
                            />
                        </div>
                        <input
                            name="subject"
                            type="text"
                            placeholder="COMMUNICATION TOPIC (SUBJECT)"
                            style={styles.input}
                            className="contact-input"
                        />
                        <textarea
                            name="message"
                            placeholder="TRANSMISSION BODY (MESSAGE)"
                            style={styles.textarea}
                            className="contact-input"
                            required
                        ></textarea>

                        <button
                            type="submit"
                            className="btn f1-skew-btn"
                            style={{ margin: '20px auto 0 auto', width: '100%', maxWidth: '280px', display: 'flex', justifyContent: 'center' }}
                            disabled={isSending}
                        >
                            <span>{isSending ? 'BUFFERING UPLINK...' : 'INITIATE TEAM RADIO'}</span>
                        </button>
                    </form>
                </RevealOnScroll>

                <div style={styles.footer}>
                    <span>&copy; {new Date().getFullYear()} ROHAN KADAM. CIRCUITS AND SYSTEMS ARCHITECTURE.</span>
                    <div style={styles.socials}>
                        <a href="https://www.linkedin.com/in/rohan-kadam-7bb932161/" target="_blank" rel="noopener noreferrer" style={styles.socialLink} className="link-hover"><i className="fab fa-linkedin"></i> LINKEDIN</a>
                        <a href="https://github.com/rohan-kadam-code" target="_blank" rel="noopener noreferrer" style={styles.socialLink} className="link-hover"><i className="fab fa-github"></i> GITHUB</a>
                        <a href="mailto:rohankadam.1023@gmail.com" style={styles.socialLink} className="link-hover"><i className="fas fa-envelope"></i> SMTP MAIL</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
