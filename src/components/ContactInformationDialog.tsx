import { Close, Email, LocationOn, Phone, Web } from "@mui/icons-material";
import { Box, Dialog, DialogActions, DialogContent, Link, Typography, styled } from "@mui/material";
import { useTranslations } from "next-intl";

interface ContactInformationDialogProps {
    openDialog: boolean;
    closeDialog: () => void;
}

export const ContactInformationDialog = ({ openDialog, closeDialog }: ContactInformationDialogProps) => {
    const t = useTranslations("HomePage");
    const ContactComponent = ({ icon, text }: { icon: JSX.Element; text: string }) => {
        return (
            <Box
                sx={{
                    display: "flex",
                    p: "12px"
                }}
            >
                {icon}
                <Box width={"20px"}></Box>
                <Typography>{text}</Typography>
            </Box>
        );
    };

    const DialogStyled = styled(Dialog)`
        .dialog-container {
            width: 600px;
            max-width: 100%;
        }

        .dialog-title {
            display: flex;
            background-color: #f1f1f1;
            justify-content: space-between;
            padding: 0.5rem 1rem;
        }
    `;

    return (
        <DialogStyled
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "12px" // Custom border radius
                }
            }}
            open={openDialog}
            onClose={closeDialog}
        >
            <div className='dialog-title'>
                <Typography
                    variant='h6'
                    style={{
                        fontWeight: "bold"
                    }}
                >
                    {t("Contact us")}
                </Typography>
                <Close
                    sx={{
                        color: "black",
                        cursor: "pointer",
                        "&:hover": {
                            color: "#D0D5DD"
                        }
                    }}
                    aria-label='close'
                    onClick={closeDialog}
                ></Close>
            </div>
            <DialogContent>
                <ContactComponent
                    icon={<LocationOn fontSize='medium' />}
                    text={t("606, Building B, Gasan Public, Digital 178 Street, Geumcheon District, Seoul City")}
                ></ContactComponent>
                <ContactComponent icon={<Phone />} text={"02-3472-3577"}></ContactComponent>
                <ContactComponent icon={<Email />} text={"cip@cip.co.kr"}></ContactComponent>
                <Box
                    sx={{
                        display: "flex",
                        p: "12px"
                    }}
                >
                    <Web />
                    <Box sx={{ width: "20px" }}></Box>
                    <Link target='_blank' href='https://www.cipsystem.co.kr'>
                        https://www.cipsystem.co.kr
                    </Link>
                </Box>
            </DialogContent>
            <DialogActions>
                <Box
                    sx={{
                        borderRadius: "8px",
                        border: 1.5,
                        borderColor: "#D0D5DD",
                        px: "40px",
                        py: "8px",
                        mr: "12px",
                        mb: "12px",
                        cursor: "pointer",
                        "&:hover": {
                            bgcolor: "#D0D5DD"
                        }
                    }}
                    onClick={closeDialog}
                >
                    <Typography fontSize={12}>{t("Close")}</Typography>
                </Box>
            </DialogActions>
        </DialogStyled>
    );
};
