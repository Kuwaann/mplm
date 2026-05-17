import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { SearchIcon } from 'lucide-react'

export default function SearchBox({ className }) {
    return (
        <InputGroup className={`w-sm max-w-sm ${className}`} >
            <InputGroupInput placeholder="Cari..." />
            <InputGroupAddon>
                <SearchIcon />
            </InputGroupAddon>
        </InputGroup >
    )
}