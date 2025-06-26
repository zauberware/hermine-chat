import React, { useState } from "react";
import { useSettings } from "../../context";
import styles from "./FeedbackDialog.module.css";
import { FeedbackDialogProps } from "./FeedbackDialog.types";

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  isOpen,
  onClose,
  messageId,
  conversationId,
  onSubmitFeedback,
}) => {
  const { settings } = useSettings();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (comment.trim() && !isSubmitting) {
      setIsSubmitting(true);
      setSubmitStatus("idle");
      
      try {
        const success = await onSubmitFeedback(messageId, conversationId, comment);
        if (success) {
          setSubmitStatus("success");
          setComment("");
          // Dialog nach 4 Sekunden schließen
          setTimeout(() => {
            onClose();
            setSubmitStatus("idle");
          }, 4000);
        } else {
          setSubmitStatus("error");
        }
      } catch (error) {
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const dialogStyle = {
    borderColor: settings.buttonColor || "#3b82f6",
  };

  const titleStyle = {
    color: settings.chatSubTitleColor || settings.buttonColor || "#3b82f6",
  };

  const buttonStyle = {
    backgroundColor:
      settings.buttonBackgroundColor || settings.buttonColor || "#3b82f6",
    color: settings.buttonColor || "white",
  };

  return (
    <div
      className={styles.dialog}
      style={dialogStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.header}>
        <h3 className={styles.title} style={titleStyle}>
          Feedback
        </h3>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>

      <div className={styles.content}>
        {submitStatus === "success" ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <p className={styles.successText}>Feedback erfolgreich gesendet!</p>
            <p className={styles.successSubtext}>Vielen Dank für Ihr Feedback.</p>
          </div>
        ) : submitStatus === "error" ? (
          <div className={styles.errorMessage}>
            <div className={styles.errorIcon}>⚠</div>
            <p className={styles.errorText}>Fehler beim Senden des Feedbacks</p>
            <p className={styles.errorSubtext}>Bitte versuchen Sie es erneut.</p>
            <button 
              className={styles.retryButton} 
              onClick={() => setSubmitStatus("idle")}
            >
              Erneut versuchen
            </button>
          </div>
        ) : (
          <>
            <div className={styles.buttonGroup}>
              <span className={styles.question}>
                Geben Sie Feedback zu dieser Nachricht. Service-Mitarbeiter und
                Administratoren des Kontos sehen Ihr Feedback und den Chat-Verlauf,
                um die KI zu verbessern.
              </span>
            </div>

            <textarea
              className={styles.commentInput}
              placeholder="Ihr Feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />

            <div className={styles.actions}>
              <button 
                className={styles.cancelButton} 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Abbrechen
              </button>
              <button
                className={styles.submitButton}
                style={buttonStyle}
                onClick={handleSubmit}
                disabled={!comment.trim() || isSubmitting}
              >
                {isSubmitting ? "Wird gesendet..." : "Senden"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackDialog;
