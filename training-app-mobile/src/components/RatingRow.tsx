import { StyleSheet } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';
import type { SessionRating } from '../api/types';
import { effortLabel } from '../features/ratings/effort';
import { formatDateTime } from '../utils/format';

type Props = {
    rating: SessionRating;
};

export function RatingRow({ rating }: Props) {
    return (
        <Card mode="outlined" style={styles.card}>
            <Card.Title
                title={effortLabel(rating.effort)}
                subtitle={formatDateTime(rating.createdAt)}
                left={() => <Avatar.Text size={40} label={String(rating.effort)} />}
            />
            {rating.note ? (
                <Card.Content>
                    <Text variant="bodyMedium">{rating.note}</Text>
                </Card.Content>
            ) : null}
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
});